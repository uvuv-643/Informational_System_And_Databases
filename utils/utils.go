package utils

import (
	"strings"
)

func ReverseStrings(a []string) {
	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		a[i], a[j] = a[j], a[i]
	}
}

func UniqueSliceElements(inputSlice [][]string) [][]string {
	uniqueSlice := make([][]string, 0, len(inputSlice))
	seen := make(map[string]bool, len(inputSlice))
	for _, element := range inputSlice {
		if !seen[strings.Join(element, "-")] {
			uniqueSlice = append(uniqueSlice, element)
			seen[strings.Join(element, "-")] = true
		}
	}
	return uniqueSlice
}
