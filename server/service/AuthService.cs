using System.Security.Claims;
using service.Abstractions;
using service.Models.Request;
using service.Models.Responses;

namespace service;

public class AuthService() : IAuthService
{
    public AuthUserInfo Authenticate(LoginRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<AuthUserInfo> Register(RegisterRequest request)
    {
        throw new NotImplementedException();
    }

    public AuthUserInfo? GetUserInfo(ClaimsPrincipal principal)
    {
        throw new NotImplementedException();
    }
}