package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/rwcarlsen/goexif/exif"
	"github.com/rwcarlsen/goexif/tiff"
	"io"
	"main/initialize"
	"math"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type PhotoRow struct {
	Id        uint32  `json:"id"`
	Path      string  `json:"path"`
	TempOrder string  `json:"order_id"`
	PhotoId   string  `json:"photo_id"`
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}

func UploadPhoto(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No photo provided"})
		return
	}
	defer file.Close()
	allowedTypes := []string{"image/jpeg", "image/png"}
	contentType := header.Header.Get("Content-Type")
	if !contains(allowedTypes, contentType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный тип файла"})
		return
	}
	filename := generateFilename(filepath.Ext(header.Filename))
	savePath := filepath.Join("uploads", filename)
	out, err := os.Create(savePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Невозможно сохранить файл"})
		return
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Невозможно сохранить файл"})
		return
	}
	var photo PhotoRow
	photo.PhotoId = c.Param("photoId")
	photo.TempOrder = c.Param("orderId")
	photo.Path = savePath
	err = readExifInfo(savePath, &photo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка в метаданных файла. Убедитесь, что включён сбор мета-информации"})
		return
	}
	err = SavePhotoObject(photo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Невозможно сохранить данные в базу"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func DeleteImage(c *gin.Context) {
	var photo PhotoRow
	photo.PhotoId = c.Param("photoId")
	photo.TempOrder = c.Param("orderId")
	execResult := initialize.DB.Raw(
		"DELETE FROM photos WHERE temp_order = ? AND photo_id = ?",
		photo.TempOrder,
		photo.PhotoId)
	_, err := execResult.Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Невозможно удалить фото"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func generateFilename(ext string) string {
	return fmt.Sprintf("photo_%d%d%s", getCurrentTimestamp(), rand.Intn(100), ext)
}

func getCurrentTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

func contains(arr []string, value string) bool {
	for _, v := range arr {
		if v == value {
			return true
		}
	}
	return false
}

type Printer struct{}

func (photo *PhotoRow) Walk(name exif.FieldName, tag *tiff.Tag) error {
	fmt.Println(fmt.Sprint(name), fmt.Sprint(tag))
	if strings.Trim(fmt.Sprint(name), " ") == "GPSLatitude" {
		value, _ := parseAndConvertToHours(fmt.Sprint(tag))
		photo.Latitude = value
	}
	if strings.Trim(fmt.Sprint(name), " ") == "GPSLongitude" {
		value, _ := parseAndConvertToHours(fmt.Sprint(tag))
		photo.Longitude = value
	}
	return nil
}

func readExifInfo(filePath string, photo *PhotoRow) error {
	f, err := os.Open(filePath)
	if err != nil {
		return err
	}
	x, err := exif.Decode(f)
	if err != nil {
		return err
	}
	err = x.Walk(photo)
	if err != nil {
		return err
	}
	if photo.Longitude != 0.0 && photo.Latitude != 0.0 {
		return nil
	}
	return errors.New("Ошибка в метаданных")
}

func parseAndConvertToHours(str string) (float64, error) {
	var timeArray []string
	err := json.Unmarshal([]byte(str), &timeArray)
	if err != nil {
		return 0, err
	}
	hours := 0.0
	for i, unit := range timeArray {
		var value, divisor int
		_, err := fmt.Sscanf(unit, "%d/%d", &value, &divisor)
		if err != nil {
			return 0, err
		}
		hours += float64(value) / math.Pow(60, float64(i)) / float64(divisor)
	}
	return hours, nil
}

func SavePhotoObject(photo PhotoRow) error {
	execResult := initialize.DB.Raw(
		"INSERT INTO photos (photo_path, temp_order, photo_id, longitude, latitude) VALUES (?, ?, ?, ?, ?)",
		photo.Path,
		photo.TempOrder,
		photo.PhotoId,
		photo.Longitude,
		photo.Latitude)
	_, err := execResult.Rows()
	return err
}
