package fund

import (
	"context"
	"sort"
)

// TODO
//  * Structured errors
//  * Hitting different endpoint depending on env
//  * Deploy to GitHub (pages) https://github.com/marketplace/actions/deploy-to-github-pages#:~:text=GitHub%20Pages%20Deploy%20Action%20%F0%9F%9A%80,works%20with%20GitHub%20Enterprise%20too.
//  * Add Go tests
//  * Add cron job
//  * Add database

var AvanzaFundIds = []string{
	"1025150", // Avanza USA
	"1041067", // Avanza Europa
	"1268",    // Länsförsäkringar Japan Indexnära
	"167",     // Öhman Etisk Index Pacific
	"944976",  // Avanza Emerging Markets
	"41567",   // Avanza Zero
	"789175",  // PLUS Småbolag Sverige Index
	"2111",    // AMF Räntefond Lång
	"2802",    // AMF Räntefond Kort
	"878733",  // Avanza Global
	"596635",  // Swedbank Robur Access Asien
	"325406",  // Spiltan Aktiefond Investmentbolag
	"862033",  // DNB Norden Indeks A
}

type Data struct {
	Name                   string  `json:"name"`
	DevelopmentThreeMonths float32 `json:"developmentThreeMonths"`
	DevelopmentSixMonths   float32 `json:"developmentSixMonths"`
	DevelopmentOneYear     float32 `json:"developmentOneYear"`
	ProductFee             float32 `json:"productFee"`
}

type Response struct {
	Id                  string  `json:"id"`
	Data                Data    `json:"data"`
	CompositePriceTrend float32 `json:"compositePriceTrend"`
	Link                string  `json:"link"`
}

type ListResponse struct {
	Funds []*Response `json:"funds"`
}

//encore:api public path=/funds
func GetTrendTrackingData(ctx context.Context) (*ListResponse, error) {
	var responseList []*Response
	for _, fundId := range AvanzaFundIds {
		avanzaFundData, err := GetAvanzaFundData(fundId)
		if err != nil {
			return nil, err
		}
		responseList = append(responseList, createResponse(avanzaFundData, fundId))
	}
	return &ListResponse{Funds: sortFundResponseList(responseList)}, nil
}

func createResponse(data *Data, fundId string) *Response {
	return &Response{
		Data:                *data,
		CompositePriceTrend: getCompositePriceTrend(data),
		Id:                  fundId,
		Link:                GetAvanzaFundLink(fundId),
	}
}

func getCompositePriceTrend(data *Data) float32 {
	return (data.DevelopmentThreeMonths + data.DevelopmentSixMonths + data.DevelopmentOneYear) / 3
}

func sortFundResponseList(responseList []*Response) []*Response {
	sort.SliceStable(responseList, func(i, j int) bool {
		return responseList[i].CompositePriceTrend > responseList[j].CompositePriceTrend
	})
	return responseList
}
