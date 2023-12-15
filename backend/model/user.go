package model

import "time"

type User struct {
	ID         uint      `json:"id" gorm:"primarykey"`
	Name       string    `json:"name"`
	Email      string    `json:"email" gorm:"unique"`
	Password   string    `json:"-"`
	DistrictId string    `json:"district_id"`
	Roles      []int32   `json:"roles" gorm:"-"`
	CreatedAt  time.Time `gorm:"-"`
	UpdatedAt  time.Time `gorm:"-"`
}
