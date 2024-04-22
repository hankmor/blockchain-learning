package main

import (
	"fmt"

	"github.com/btcsuite/btcd/btcjson"
)

func decodeRawTx() {
	cmd := btcjson.NewGetRawTransactionCmd("aa34b9395de255efe33b23af43fd33298e273843ebba8cd68ca6dd123aa65975", btcjson.Int(0))
	bs, err := btcjson.MarshalCmd(btcjson.RpcVersion1, 1, cmd)
	if err != nil {
		panic(err)
	}
	fmt.Printf("result: %s\n", bs)
}
