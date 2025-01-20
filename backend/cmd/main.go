package main

import (
	"fmt"
	"net/http"

	"backend/internal/routes"
)

func main() {
	r := routes.InitRoutes()
	port := 8080
	fmt.Printf("服务已启动, 监听端口: %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), r)
}
