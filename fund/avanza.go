package fund

import (
	"encoding/json"
	"net/http"
)

func GetAvanzaFundData(fundId string) (*Data, error) {
	URL := "https://www.avanza.se/_api/fund-guide/guide/" + fundId
	resp, err := http.Get(URL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var fundResponse *Data
	if err := json.NewDecoder(resp.Body).Decode(&fundResponse); err != nil {
		return nil, err
	}
	return fundResponse, nil
}

func GetAvanzaFundLink(fundId string) string {
	return "https://www.avanza.se/fonder/om-fonden.html/" + fundId
}
