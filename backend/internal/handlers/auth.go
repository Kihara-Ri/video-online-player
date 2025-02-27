package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	Token   string `json:"token"`
}

// 模拟用户数据库
var users = map[string]string{
	"admin":  "Password030207",
	"kihara": "Password030207",
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("进入 LoginHandler, 发起登录请求")
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "请求格式错误", http.StatusBadRequest)
		fmt.Println("请求格式错误:", err)
		return
	}

	// 验证用户名和密码
	password, exists := users[req.Username]
	if !exists || password != req.Password {
		http.Error(w, "用户名或密码错误", http.StatusUnauthorized)
		fmt.Println("错误的用户名:", req.Username)
		fmt.Println("错误的密码:", req.Password)
		return
	}

	token := "secure-token-example"
	http.SetCookie(w, &http.Cookie{
		Name:  "token",
		Value: token,
		Path:  "/",
	})

	response := LoginResponse{
		Message: "登录成功",
		Token:   token,
	}

	fmt.Println("用户", req.Username, "登录成功")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
