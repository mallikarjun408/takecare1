// invalid request , param missing

{
	"readyState": 4,
	"responseText": "{\"error_description\":\"grant_type is required\",\"error\":\"invalid_request\"}\r\n",
	"responseJSON": {
		"error_description": "grant_type is required",
		"error": "invalid_request"
	},
	"status": 400,
	"statusText": "error"
}

// with no proper grant_type
{
	"readyState": 4,
	"responseText": "{\"error\":\"unsupported_grant_type\"}\r\n",
	"responseJSON": {
		"error": "unsupported_grant_type"
	},
	"status": 400,
	"statusText": "error"
} {
	"readyState": 4,
	"responseText": "{\"error\":\"unsupported_grant_type\"}\r\n",
	"responseJSON": {
		"error": "unsupported_grant_type"
	},
	"status": 400,
	"statusText": "error"
}
// code verifier not passed
{
	"readyState": 4,
	"responseText": "{\"error_description\":\"The code_verifier sent does not match code_challenge included in the authorization request using the S256 code_challenge_method.\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "The code_verifier sent does not match code_challenge included in the authorization request using the S256 code_challenge_method.",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "error"
}

// redirect url not passed

{
	"readyState": 4,
	"responseText": "{\"error_description\":\"redirect_uri is required if it was included in the authorization request.\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "redirect_uri is required if it was included in the authorization request.",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "error"
}

// with error client ID

{
	"readyState": 4,
	"responseText": "{\"error_description\":\"Invalid client or client credentials\",\"error\":\"invalid_client\"}\r\n",
	"responseJSON": {
		"error_description": "Invalid client or client credentials",
		"error": "invalid_client"
	},
	"status": 401,
	"statusText": "error"
}

// with no code
{
	"readyState": 4,
	"responseText": "{\"error_description\":\"Authorization code is malformed.\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "Authorization code is malformed.",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "error"
}

 // invalid
{
	"readyState": 4,
	"responseText": "{\"error_description\":\"Authorization code is invalid or expired.\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "Authorization code is invalid or expired.",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "error"
}

// old access token to gen new access token vvia refresh token
{"fault":{"faultstring":"Invalid Access Token", "detail":{"errorcode":"keymanagement.service.invalid_access_token"}}}

// expired access token

{
	"readyState": 4,
	"responseText": "{\"error_description\":\"unknown, invalid, or expired refresh token\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "unknown, invalid, or expired refresh token",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "Bad Request"
}

// at customer details with expired token trying to access website
{
	"readyState": 4,
	"responseText": "{\"fault\":{\"faultstring\":\"Invalid Access Token\", \"detail\":{\"errorcode\":\"keymanagement.service.invalid_access_token\"}}}",
	"status": 401,
	"statusText": "Server Error"
}

// with expired token and refresh token

{
	"readyState": 4,
	"responseText": "{\"error_description\":\"unknown, invalid, or expired refresh token\",\"error\":\"invalid_grant\"}\r\n",
	"responseJSON": {
		"error_description": "unknown, invalid, or expired refresh token",
		"error": "invalid_grant"
	},
	"status": 400,
	"statusText": "Bad Request"
}

// invalid Access Token

{
	"readyState": 4,
	"responseText": "{\"fault\":{\"faultstring\":\"Invalid Access Token\", \"detail\":{\"errorcode\":\"keymanagement.service.invalid_access_token\"}}}",
	"status": 401,
	"statusText": "Server Error"
}
