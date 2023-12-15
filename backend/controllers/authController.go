package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"main/initialize"
	"main/model"
	"main/repository"
	"net/http"
	"os"
	"strconv"
	"time"
)

func Register(c *gin.Context) {
	var data struct {
		Email      string `json:"email"`
		DistrictId int32  `json:"district_id"`
		Name       string `json:"name"`
		Password   string `json:"password"`
	}
	if c.BindJSON(&data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Убедитесь, что все данные введены корректно",
		})
		return
	}
	fmt.Println(data)
	hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Проверьте, что все данные введены корректно",
		})
		return
	}
	user := model.User{Email: data.Email, Password: string(hash), Name: data.Name, DistrictId: strconv.Itoa(int(data.DistrictId))}
	result := initialize.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Пользователь с таким e-mail уже существует или не выбран район.",
		})
		return
	}
	user.Roles = make([]int32, 1)
	if repository.IsUserAdmin(user) {
		user.Roles = append(user.Roles, 1)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно создать токен",
		})
		return
	}
	//c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", true, true)
	c.JSON(http.StatusOK, user)
}

func Login(c *gin.Context) {
	var data struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if c.BindJSON(&data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Проверьте, что все данные введены корректно.",
		})
		return
	}
	var user model.User
	initialize.DB.First(&user, "email = ?", data.Email)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Пользователя с таким логином и паролем не существует",
		})
		return
	}
	user.Roles = make([]int32, 1)
	if repository.IsUserAdmin(user) {
		user.Roles = append(user.Roles, 1)
	}
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Пользователя с таким логином и паролем не существует",
		})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно создать токен.",
		})
		return
	}
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", true, true)
	c.JSON(http.StatusOK, user)
}

func Logout(c *gin.Context) {
	c.SetCookie("Authorization", "", 3600*24*30, "", "", false, true)
}

func User(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(http.StatusOK, user)
}
