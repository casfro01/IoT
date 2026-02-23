using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Abstractions;
using service.Models.Responses;
using service.Security;
using service.Models.Request;

namespace api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService service, ITokenService tokenService) : ControllerBase
{
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var userInfo = service.Authenticate(request);
        var token = tokenService.CreateToken(userInfo);
        return new LoginResponse(token);
    }

    [HttpPost]
    [Route("register")]
    [AllowAnonymous]
    public async Task<RegisterResponse> Register([FromBody] RegisterRequest request)
    {
        var userInfo = await service.Register(request);
        return new RegisterResponse(UserName: userInfo.UserName);
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IResult> Logout()
    {
        throw new NotImplementedException();
    }

    [HttpGet]
    [Route("userinfo")]
    public async Task<AuthUserInfo?> UserInfo()
    {
        return service.GetUserInfo(User);
    }
}