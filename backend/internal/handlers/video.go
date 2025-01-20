package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// 视频存放目录
var videoDirs = []string{
	"/mnt/my_hdd/bangumi",
	"/mnt/my_hdd/downloads",
	"/mnt/my_hdd/shows",
}

type Video struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

// GetVideoHandler 处理视频请求
func GetVideoHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	videoName := query.Get("name")

	if videoName == "" {
		http.Error(w, "视频名称未提供", http.StatusBadRequest)
		return
	}

	// 允许的扩展名
	allowedExtensions := []string{".mp4", ".mkv"}

	var foundVideo *Video

	// 在多个目录中查找视频文件
	for _, dir := range videoDirs {
		for _, ext := range allowedExtensions {
			videoPath := filepath.Join(dir, videoName+ext)
			if _, err := os.Stat(videoPath); err == nil {
				foundVideo = &Video{
					Name: videoName + ext,
					Path: "/videos/" + videoName + ext, // 提供给前端访问路径
				}
				break
			}
		}
		if foundVideo != nil {
			break
		}
	}
	if foundVideo == nil {
		http.Error(w, "视频文件未找到", http.StatusNotFound)
		return
	}

	// 返回视频数据
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(foundVideo)
}

// GetAllVideosHandler 处理所有视频
func GetAllVideosHandler(w http.ResponseWriter, r *http.Request) {
	allowedExtensions := []string{".mp4", ".mkv"}
	var allVideos []Video

	for _, dir := range videoDirs {
		err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// 检查文件是否符合要求
			if !info.IsDir() {
				ext := strings.ToLower(filepath.Ext(info.Name()))
				for _, allowedExt := range allowedExtensions {
					if ext == allowedExt {
						allVideos = append(allVideos, Video{
							Name: info.Name(),
							Path: "/videos/" + strings.TrimPrefix(path, "/mnt/my_hdd"),
						})
					}
				}
			}
			return nil
		})
		if err != nil {
			http.Error(w, "无法读取目录: "+dir, http.StatusInternalServerError)
			return
		}
	}

	// 返回视频列表
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allVideos)
}
