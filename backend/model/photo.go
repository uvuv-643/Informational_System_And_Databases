package model

type PhotoRow struct {
	Id        uint32  `json:"id"`
	Path      string  `json:"path"`
	TempOrder string  `json:"order_id"`
	PhotoId   string  `json:"photo_id"`
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}
