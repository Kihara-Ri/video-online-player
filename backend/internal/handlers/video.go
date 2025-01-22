package handlers

// 视频请求处理实现

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// 视频存放目录
var baseDirs = map[string]string{
	"bangumi":   "/mnt/my_hdd/bangumi",
	"shows":     "/mnt/my_hdd/shows",
	"downloads": "/mnt/my_hdd/downloads",
}

// 响应结构体
type Item struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Type string `json:"type"`
}

// 处理前端单层目录请求
func ListSingleDir(w http.ResponseWriter, r *http.Request) {
	// 从 URL 查询参数获取 dir 值
	dir := r.URL.Query().Get("dir")
	fmt.Println("\nr.URL.Query().Get('dir') || 前端请求文件路径: ", dir)
	fmt.Println("请求的API r.URL.Path: ", r.URL.Path)

	dirType := strings.Split(dir, "/")[0] // 获取 bangumi, shows, downloads
	fmt.Println("获取的dirType: ", dirType)

	// 检查是否是合法的目录类型
	basePath, exists := baseDirs[dirType]
	if !exists {
		http.Error(w, "无效的目录类型", http.StatusBadRequest)
		return
	}
	fmt.Println("获取的basePath: ", basePath)
	// 拼接完整路径
	var fullPath string
	if dir == "bangumi" || dir == "shows" || dir == "downloads" {
		fullPath = basePath
	} else {
		fullPath = filepath.Join(removeLastSegment(basePath), dir)
	}
	fmt.Println("获取的fullPath: ", fullPath)

	// 读取目录内容
	files, err := os.ReadDir(fullPath)
	if err != nil {
		http.Error(w, "读取目录失败", http.StatusInternalServerError)
		return
	}

	var items []Item

	for _, file := range files {
		itemType := "directory"
		if !file.IsDir() {
			ext := strings.ToLower(filepath.Ext(file.Name()))
			if ext == ".mp4" || ext == ".mkv" {
				itemType = "video"
			} else {
				continue // 忽略非视频文件
			}
		}

		items = append(items, Item{
			Name: file.Name(),
			Path: filepath.Join(dir, file.Name()),
			Type: itemType,
		})
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func removeLastSegment(path string) string {
	// 使用 strings.Split 分割路径
	parts := strings.Split(path, "/")
	// 去掉最后一个部分
	if len(parts) > 1 {
		parts = parts[:len(parts)-1]
	}
	// 重新组合路径
	return strings.Join(parts, "/")
}
