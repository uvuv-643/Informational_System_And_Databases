package model

type VotingRow struct {
	Id               int32  `json:"id"`
	Status           string `json:"status"`
	For              int32  `json:"for"`
	Against          int32  `json:"against"`
	OrderDescription string `json:"order_description"`
}
