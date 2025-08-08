# Use the .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["BudgetApi.csproj", "."]
RUN dotnet restore "./BudgetApi.csproj"

# Copy the rest of the application code and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "BudgetApi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "BudgetApi.csproj" -c Release -o /app/publish

# Use the .NET 8 ASP.NET runtime image for the final, smaller image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BudgetApi.dll"]