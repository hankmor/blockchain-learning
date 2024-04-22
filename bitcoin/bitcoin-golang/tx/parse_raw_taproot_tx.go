package tx

import (
	"bytes"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"os"
)

func ParseRawTx(txhex string) {
    txbin, err := hex.DecodeString(txhex)
    check(err)

    buf := bytes.NewBuffer(txbin)

    // VERSION
    version := buf.Next(4)
    fmt.Printf("Version = %x\n", version)

    // OPTIONAL SEGWIT MARKER AND FLAG
    // OR INPUT COUNT
    var segwitMarker, segwitFlag byte // each defaults to 0
    inputCount := NextCInt(buf)
    if inputCount == 0 { // It's a Segwit marker, not an input count
        segwitFlag, err = buf.ReadByte() // expect 1
        check(err)
        fmt.Printf("Segwit Marker = %x, Flag = %x\n", segwitMarker, segwitFlag) // 包含隔离见证的交易中，marker为0，flag为1
        inputCount = NextCInt(buf)
    }
    fmt.Printf("Input Count = %d\n", inputCount)


    // INPUTS
    for i := 0; i < int(inputCount); i++ {
        txid := buf.Next(32)
        vout := binary.LittleEndian.Uint32(buf.Next(4))
        scriptLen := NextCInt(buf)
        fmt.Printf("Input %d: tx = %x vout = %d\n", i+1, txid, vout)
        fmt.Printf("\tUnlocking Script length = %d\n", scriptLen)
        if scriptLen > 0 {
            script := buf.Next(int(scriptLen))
            fmt.Printf("\tScript = %x\n", script)
        }
    }

    // SEQUENCE
    sequence := buf.Next(4)
    fmt.Printf("Sequence = %x\n", sequence)

    // OUTPUTS
    outCount := NextCInt(buf)
    fmt.Printf("Output count = %d\n", outCount)
    var txValue uint64
    for o := 0; o < int(outCount); o++ {
        amount := binary.LittleEndian.Uint64(buf.Next(8))
        scriptLen := NextCInt(buf)
        script := buf.Next(int(scriptLen))
        fmt.Printf("Output %d: value = %d script = %x\n", o+1, amount, script)
        txValue += amount
    }


    //WITNESSES, 当前版本协议 marker 为0，falg为1
    if segwitFlag != 0 {
        for i:=0; i<int(inputCount); i++ {
            compCount := NextCInt(buf) // witeness count
            for c:=0; c<int(compCount); c++ {
                l := NextCInt(buf) // witeness size
                if l > 0 {
                    component := buf.Next(int(l))
                    fmt.Printf("Witness %d component %d = %x\n", 
                        i+1, c+1, component)
                }
            }
        }
    }

    // LOCKTIME
    lockTime := buf.Next(4)
    fmt.Printf("Locktime  = %x\n", lockTime)

    // DERIVED DATA
    fmt.Printf("\n(Tx value (less fee) = %d)\n", txValue)
}

// Extracts a Compact Int
func NextCInt(buf *bytes.Buffer) (uint64) {
    var result uint64
    first, err := buf.ReadByte()
    check(err)
    switch first {
    case 0xFF :
        result = binary.LittleEndian.Uint64(buf.Next(8))
    case 0xFE :
        result = uint64(binary.LittleEndian.Uint32(buf.Next(4)))
    case 0xFD :
        result = uint64(binary.LittleEndian.Uint16(buf.Next(2)))
    default :
        result = uint64(first)
    }
    return result
}

// Rudimentary error handling
func check(err error) {
    if err != nil {
        fmt.Fprint(os.Stderr, err)
        os.Exit(1)
    }
}
