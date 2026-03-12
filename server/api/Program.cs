
using System.Text.Json.Serialization;
using api.Seeders;
using dataaccess;
using DataAccess.Entities;
using DefaultNamespace;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using service;
using service.Abstractions;
using service.Security;
using Sieve.Services;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.Extensions;
using StateleSSE.AspNetCore.GroupRealtime;

namespace api;
public class Program
{
    public static void ConfigureServices(IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddSingleton<AppOptions>(provider =>
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var appOptions = new AppOptions();
            configuration.GetSection(nameof(AppOptions)).Bind(appOptions);
            return appOptions;
        });
        services.AddOpenApiDocument();

        // repos
        // services
        services.AddScoped<ISieveProcessor, SieveProcessor>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, JwtService>();
        services.AddScoped<IPasswordHasher<User>, NSecArgon2IdPasswordHasher>();
        services.AddScoped<ITurbineService, TurbineService>();
        services.AddScoped<IAlertService, AlertService>();
        services.AddScoped<TurbineSubscriberService>();
        services.AddScoped<AlertSubscriberService>();
        services.AddScoped<CommandValidator>();
        
        // seeder
        //services.AddScoped<ISeeder, BogusSeed>();
        services.AddScoped<ISeeder, UserSeeder>();
        
        services.AddProblemDetails();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        
        // redis + backplane
        //builder.Services.AddRedisSseBackplane(); // aktiver, når man er tættere på produktions dagen
        builder.Services.AddInMemorySseBackplane();
        builder.Services.AddGroupRealtime();
        builder.Services.AddEfRealtime();
        
        // Dbcontext
        services.AddDbContext<MyDbContext>((services, options) =>
        {
            options.UseNpgsql(services.GetRequiredService<AppOptions>().DbConnectionString)
                /*.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)*/;
            
            options.AddEfRealtimeInterceptor(services); // hooks into SaveChanges
        });
        
        
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = JwtService.ValidationParameters(
                    builder.Configuration
                );
                // Add this for debugging
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Authentication failed: {context.Exception}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine("Token validated successfully");
                        return Task.CompletedTask;
                    },
                };
            });
        services.AddAuthorization(options =>
        {
            options.FallbackPolicy = new AuthorizationPolicyBuilder()
                // Globally require users to be authenticated
                .RequireAuthenticatedUser()
                .Build();
        });
        
        
        
        
        services.AddMqttControllers();
        services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.WriteIndented = true;
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
        
        services.AddCors();
    }
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        ConfigureServices(builder.Services, builder);
        
        var app = builder.Build();
        
        
        app.UseOpenApi();
        app.UseSwaggerUi();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        
        //app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(x => true));

        // config færdig her
        app.GenerateApiClientsFromOpenApi("/../../client/src/core/ServerAPI.ts").GetAwaiter().GetResult();
        // for development
        using (var scope = app.Services.CreateScope())
        {
            // Add mqtt 
            var mqtt = app.Services.GetRequiredService<IMqttClientService>();
            mqtt.ConnectAsync("broker.hivemq.com", 1883).GetAwaiter().GetResult();
            
            
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            db.Database.EnsureCreated();
            //scope.ServiceProvider.GetRequiredService<ISeeder>().Seed().GetAwaiter().GetResult();
        }
        
        app.Run();
        
    }
}
