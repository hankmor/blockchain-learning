package main

import (
	"fmt"

	"github.com/btcsuite/btcd/btcjson"
)

// func main() {
//     cmd := btcjson.NewGetRawTransactionCmd("aa34b9395de255efe33b23af43fd33298e273843ebba8cd68ca6dd123aa65975", btcjson.Int(0))
//     btcjson.RegisterCmd(cmd)
//     cmd := btcjson.NewDecodeRawTransactionCmd()
// }

func getBlock()  {
   	// Create a new getblock command.  Notice the nil parameter indicates
	// to use the default parameter for that fields.  This is a common
	// pattern used in all of the New<Foo>Cmd functions in this package for
	// optional fields.  Also, notice the call to btcjson.Bool which is a
	// convenience function for creating a pointer out of a primitive for
	// optional parameters.
	blockHash := "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
	gbCmd := btcjson.NewGetBlockCmd(blockHash, btcjson.Int(0))

	// Marshal the command to the format suitable for sending to the RPC
	// server.  Typically the client would increment the id here which is
	// request so the response can be identified.
	id := 1
	marshalledBytes, err := btcjson.MarshalCmd(btcjson.RpcVersion1, id, gbCmd)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Display the marshalled command.  Ordinarily this would be sent across
	// the wire to the RPC server, but for this example, just display it.
	fmt.Printf("%s\n", marshalledBytes) 
}
