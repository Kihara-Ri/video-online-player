package routes

// API 和路由定义

import (
	"backend/internal/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	r := mux.NewRouter()

	//API 路由
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")

	r.HandleFunc("/api/bangumi", handlers.ListSingleDir).Methods("GET")
	r.HandleFunc("/api/shows", handlers.ListSingleDir).Methods("GET")
	r.HandleFunc("/api/downloads", handlers.ListSingleDir).Methods("GET")

	// 提供前端静态页面
	// r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./frontend/build"))))

	// 提供静态视频访问服务
	r.PathPrefix("/videos/").Handler(http.StripPrefix("/videos/", http.FileServer(http.Dir("/mnt/my_hdd"))))

	return r
}
