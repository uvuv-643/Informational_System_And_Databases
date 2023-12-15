package model

type OrderRow struct {
	Id          int32        `json:"id"`
	Description string       `json:"description"`
	Location    *LocationRow `json:"location"`
	Voting      *VotingRow   `json:"voting"`
	Jobs        []JobRow     `json:"jobs"`
	Photos      []PhotoRow   `json:"photos"`
}
