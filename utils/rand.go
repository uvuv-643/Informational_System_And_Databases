package utils

import (
	"github.com/go-faker/faker/v4"
	"math/rand"
	"strconv"
	"time"
)

type City struct {
	RealAddress faker.RealAddress `faker:"real_address"`
}

type Person struct {
	FirstName string `faker:"first_name"`
}

type Word struct {
	Word     string `faker:"word"`
	Sentence string `faker:"sentence"`
}

type Timestamp struct {
	Timestamp string `faker:"unix_time"`
}

func randomTimestamp() string {
	randomTime := rand.Int63n(time.Now().Unix()-94608000) + 94608000
	randomNow := time.Unix(randomTime, 0)
	return randomNow.Format("2006-01-02 15:04:05")
}

func Rand(_type string) (string, string) {
	if _type == "city" {
		a := City{}
		err := faker.FakeData(&a)
		if err != nil {
			return "", "string"
		}
		return a.RealAddress.City, "string"
	} else if _type == "district" {
		a := City{}
		err := faker.FakeData(&a)
		if err != nil {
			return "", "string"
		}
		return a.RealAddress.State, "string"
	} else if _type == "name" {
		a := Person{}
		err := faker.FakeData(&a)
		if err != nil {
			return "", "string"
		}
		return a.FirstName, "string"
	} else if _type == "house" {
		return strconv.Itoa(int(rand.Int63n(1500))), "string"
	} else if _type == "street" {
		a := City{}
		err := faker.FakeData(&a)
		if err != nil {
			return "", "string"
		}
		return a.RealAddress.Address, "string"
	} else if _type == "description" {
		return strconv.Itoa(int(rand.Int63n(1500))), "string"
	} else if _type == "street" {
		a := Word{}
		err := faker.FakeData(&a)
		if err != nil {
			return "", "string"
		}
		return a.Sentence, "string"
	} else if _type == "timestamp" {
		return randomTimestamp(), "string"
	} else if _type == "bool" {
		return strconv.Itoa(int(rand.Int63n(2))), "string"
	}

	a := Word{}
	err := faker.FakeData(&a)
	if err != nil {
		return "", "string"
	}
	return a.Word, "string"
}
