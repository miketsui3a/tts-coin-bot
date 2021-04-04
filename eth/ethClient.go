package ethClient

import "github.com/ethereum/go-ethereum/ethclient"

func NewEthClient() *Client {
	client, err := ethclient.Dial("https://mainnet.infura.io")
	if err != nil {
		panic("Cannot create ethClient")
	}

	return client

}
