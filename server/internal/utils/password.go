package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
)

func GenerateSalt() (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(salt), nil
}

func HashPassword(password, salt string) string {
	h := sha256.New()
	h.Write([]byte(salt + password))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

func VerifyPassword(password, salt, expectedHash string) bool {
	return HashPassword(password, salt) == expectedHash
}
