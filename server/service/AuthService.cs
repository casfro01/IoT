using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using service.Abstractions;
using service.Models.Request;
using service.Models.Responses;

namespace service;

public class AuthService(MyDbContext ctx, IPasswordHasher<User> hasher) : IAuthService
{
    public AuthUserInfo Authenticate(LoginRequest request)
    {
        Validator.ValidateObject(request, new ValidationContext(request), true);
        
        // kaster InvalidOperationException hvis brugeren ikke findes
        var user = ctx.Users.First(u => u.Email == request.Email);
        
        var res = hasher.VerifyHashedPassword(user, user.Passwordhash, request.Password);
        return res != PasswordVerificationResult.Success ? throw new ValidationException("invalid email or password") : new AuthUserInfo(user.Id, user.Email, "Operator");
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