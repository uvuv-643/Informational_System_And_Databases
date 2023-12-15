package controllers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"main/initialize"
	"main/model"
	"main/repository"
	"net/http"
)

type VotingItem struct {
	Voting model.VotingRow `json:"voting"`
}

func Voting(c *gin.Context) {
	votingId := c.Param("id")
	queryResult := initialize.DB.Raw("SELECT id, status, ffor, against, order_description FROM get_voting_information_by_id(?)", votingId)
	rows, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно получить данные по голосованию",
		})
		return
	}
	var rowSlice []model.VotingRow
	for rows.Next() {
		var s model.VotingRow
		err = rows.Scan(&s.Id, &s.Status, &s.For, &s.Against, &s.OrderDescription)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Невозможно получить данные по голосованию",
			})
			return
		}
		rowSlice = append(rowSlice, s)
	}
	var voting *model.VotingRow
	if len(rowSlice) > 0 {
		voting = &rowSlice[0]
	} else {
		voting = nil
	}
	c.JSON(200, VotingItem{*voting})

}

func Votings(c *gin.Context) {

	user, _ := c.Get("user")
	userModel := user.(model.User)
	var queryResult *gorm.DB
	queryResult = initialize.DB.Raw("SELECT id, description FROM get_orders_from_user_district(?)", userModel.ID)
	rows, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Невозможно получить заказы из базы1",
		})
		return
	}
	var rowSlice = make([]model.OrderRow, 0)
	for rows.Next() {
		var r model.OrderRow
		err := rows.Scan(&r.Id, &r.Description)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Невозможно получить заказы из базы2",
			})
			return
		}
		err = repository.FillOrderInformation(&r)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		rowSlice = append(rowSlice, r)
	}

	c.JSON(200, OrdersRows{rowSlice})

}

func ChangeVotingStatus(c *gin.Context) {
	queryResult := initialize.DB.Raw("SELECT change_voting_status(?)", c.Param("orderId"))
	_, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Вы не можете редактировать данную заявку",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
	})

}

func MakeVote(c *gin.Context) {
	user, _ := c.Get("user")
	userModel := user.(model.User)
	queryResult := initialize.DB.Raw("SELECT make_vote(?, ?, ?)", userModel.ID, c.Param("votingId"), (c.Param("vote") == "1"))
	_, err := queryResult.Rows()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Вы либо уже отдали голос за эту инициативу, либо вы проживаете в другом районе.",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
	})
}
