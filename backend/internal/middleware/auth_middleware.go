package middleware

import (
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil || cookie.Value != "secure-token-example" {
			http.Error(w, "未授权访问", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
