package routes

import (
	"backend/internal/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	r := mux.NewRouter()

	//API 路由
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/videos", handlers.GetAllVideosHandler).Methods("GET")

	// 提供静态视频访问服务
	r.PathPrefix("/videos/").Handler(http.StripPrefix("/videos/", http.FileServer(http.Dir("/mnt/my_hdd"))))

	return r
}
