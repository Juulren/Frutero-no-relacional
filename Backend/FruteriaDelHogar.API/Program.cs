
using FruteriaDelHogar.API.Data;
using FruteriaDelHogar.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Configurar base de datos (LiteDB)
builder.Services.AddSingleton<LiteDbContext>();

// Inyectar Servicios
builder.Services.AddScoped<ProductoService>();
builder.Services.AddScoped<ProveedorService>();
builder.Services.AddScoped<VentaService>();
builder.Services.AddScoped<InventarioService>();
builder.Services.AddScoped<DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // typical Vite / CRA ports
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

// Seed LiteDB on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LiteDbContext>();
    DatabaseSeeder.Seed(context);
}

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
