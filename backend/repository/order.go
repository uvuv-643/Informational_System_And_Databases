package repository

import (
	"errors"
	"main/initialize"
	"main/model"
)

func fillOrderLocation(r *model.OrderRow) error {
	queryResult := initialize.DB.Raw("SELECT full_address, district FROM get_location_information(?)", r.Id)
	rows, err := queryResult.Rows()
	if err != nil {
		return errors.New("Невозможно получить данные по голосованию")
	}
	var rowSlice []model.LocationRow
	for rows.Next() {
		var s model.LocationRow
		err := rows.Scan(&s.FullAddress, &s.District)
		if err != nil {
			return errors.New("Невозможно получить данные по голосованию")
		}
		rowSlice = append(rowSlice, s)
	}
	if len(rowSlice) > 0 {
		r.Location = &rowSlice[0]
	} else {
		r.Location = nil
	}
	return nil
}

func fillOrderVoting(r *model.OrderRow) error {
	queryResult := initialize.DB.Raw("SELECT id, status, ffor, against FROM get_voting_information(?)", r.Id)
	rows, err := queryResult.Rows()
	if err != nil {
		return errors.New("Невозможно получить данные по голосованию")
	}
	var rowSlice []model.VotingRow
	for rows.Next() {
		var s model.VotingRow
		err := rows.Scan(&s.Id, &s.Status, &s.For, &s.Against)
		s.OrderDescription = r.Description
		if err != nil {
			return errors.New("Невозможно получить данные по голосованию")
		}
		rowSlice = append(rowSlice, s)
	}
	if len(rowSlice) > 0 {
		r.Voting = &rowSlice[0]
	} else {
		r.Voting = nil
	}
	return nil
}

func fillOrderJobs(r *model.OrderRow) error {
	queryResult := initialize.DB.Raw("SELECT id, status FROM get_jobs_information(?)", r.Id)
	rows, err := queryResult.Rows()
	if err != nil {
		return errors.New("Невозможно получить данные по работам")
	}
	var rowSlice = make([]model.JobRow, 0)
	for rows.Next() {
		var s model.JobRow
		err := rows.Scan(&s.Id, &s.Status)
		if err != nil {
			return errors.New("Невозможно получить данные по работам")
		}
		rowSlice = append(rowSlice, s)
	}
	r.Jobs = rowSlice
	return nil
}

func fillOrderPhotos(r *model.OrderRow) error {
	queryResult := initialize.DB.Raw("SELECT id, path FROM get_photos_information(?)", r.Id)
	rows, err := queryResult.Rows()
	if err != nil {
		return errors.New("Невозможно получить данные по прикрепленным фото")
	}
	var rowSlice = make([]model.PhotoRow, 0)
	for rows.Next() {
		var s model.PhotoRow
		err := rows.Scan(&s.Id, &s.Path)
		if err != nil {
			return errors.New("Невозможно получить данные по прикрепленным фото")
		}
		rowSlice = append(rowSlice, s)
	}
	r.Photos = rowSlice
	return nil
}

func FillOrderInformation(r *model.OrderRow) error {
	var err error
	err = fillOrderLocation(r)
	if err != nil {
		return err
	}
	err = fillOrderVoting(r)
	if err != nil {
		return err
	}
	err = fillOrderJobs(r)
	if err != nil {
		return err
	}
	err = fillOrderPhotos(r)
	if err != nil {
		return err
	}
	return nil
}
