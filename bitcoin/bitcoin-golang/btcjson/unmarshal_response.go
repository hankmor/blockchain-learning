package main

import (
	"encoding/json"
	"fmt"

	"github.com/btcsuite/btcd/btcjson"
)

func unmarshalResp() {
	// Ordinarily this would be read from the wire, but for this example,
	// it is hard coded here for clarity.  This is an example response to a
	// getblockheight request.
	data := []byte(`{"jsonrpc":"1.0","result":350001,"error":null,"id":1}`)

	// Unmarshal the raw bytes from the wire into a JSON-RPC response.
	var response btcjson.Response
	if err := json.Unmarshal(data, &response); err != nil {
		fmt.Println("Malformed JSON-RPC response:", err)
		return
	}

	// Check the response for an error from the server.  For example, the
	// server might return an error if an invalid/unknown block hash is
	// requested.
	if response.Error != nil {
		fmt.Println(response.Error)
		return
	}

	// Unmarshal the result into the expected type for the response.
	var blockHeight int32
	if err := json.Unmarshal(response.Result, &blockHeight); err != nil {
		fmt.Printf("Unexpected result type: %T\n", response.Result)
		return
	}
	fmt.Println("Block height:", blockHeight)

}
