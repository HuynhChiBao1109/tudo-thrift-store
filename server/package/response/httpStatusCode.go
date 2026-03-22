package response

const (
	StatusOK           = 200
	StatusBadRequest   = 400
	StatusUnauthorized = 401
	StatusForbidden    = 403
	StatusNotFound     = 404
	StatusServerError  = 500
)

var msg = map[int]string{
	StatusOK:           "OK",
	StatusBadRequest:   "Bad Request",
	StatusUnauthorized: "Unauthorized",
	StatusForbidden:    "Forbidden",
	StatusNotFound:     "Not Found",
	StatusServerError:  "Internal Server Error",
}
