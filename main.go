package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
)

var templates = template.Must(template.ParseGlob("templates/*.html"))
var videoDir string

const port = 8080

func init() {
	// 定义命令行参数
	flag.StringVar(&videoDir, "dir", "./videos", "指定视频文件存放目录")
}

func main() {
	// 解析命令行参数
	flag.Parse()

	// 检查目录是否存在
	if _, err := os.Stat(videoDir); os.IsNotExist(err) {
		log.Fatalf("指定的目录不存在: %s", videoDir)
	}

	fmt.Printf("服务已运行在端口: %d", port)

	// 静态文件路径映射
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	// 视频文件路径映射
	http.Handle("/videos/", http.StripPrefix("/videos", http.FileServer(http.Dir(videoDir))))
	// 设置页面处理
	http.HandleFunc("/", serveIndex)
	http.HandleFunc("/play", servePlayer)

	// 启动服务
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatalf("服务启动失败: %v", err)
	}
}

// 自动读取指定目录下的视频和文件夹
func serveIndex(w http.ResponseWriter, r *http.Request) {
	dir := r.URL.Query().Get("dir")
	if dir == "" {
		dir = videoDir
	}

	files, err := os.ReadDir(dir)
	if err != nil {
		http.Error(w, "无法读取目录", http.StatusInternalServerError)
		return
	}

	data := struct {
		CurrentDir string
		Files      []os.DirEntry
	}{
		CurrentDir: dir,
		Files:      files,
	}

	err = templates.ExecuteTemplate(w, "index.html", data)
	if err != nil {
		http.Error(w, "无法渲染模板", http.StatusInternalServerError)
	}
}

// 提供视频播放页面, 支持在线播放
func servePlayer(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Query().Get("file")
	if file == "" {
		http.Error(w, "未指定视频文件", http.StatusBadRequest)
		return
	}

	// 确保文件路径是相对的 (去掉绝对路径前缀)
	relativePath := file[len(videoDir):]
	if relativePath[0] == '/' {
		relativePath = relativePath[1:]
	}

	data := struct {
		FilePath string
	}{
		FilePath: "/videos/" + relativePath, // 保持与静态文件映射一致
	}

	err := templates.ExecuteTemplate(w, "player.html", data)
	if err != nil {
		http.Error(w, "无法渲染模板", http.StatusInternalServerError)
	}
}

func addCORSHeaders(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		h.ServeHTTP(w, r)
	})
}
