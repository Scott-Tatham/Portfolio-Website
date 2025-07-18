namespace PortfolioWebsite
{
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components.Web;
    using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
    using Microsoft.Extensions.DependencyInjection;

    /// <summary>
    /// The entry point of the application.
    /// </summary>
    public class Program
    {
        #region Initialisation
        
        public static async Task Main(string[] args)
        {
            WebAssemblyHostBuilder webAssemblyHostBuilder = WebAssemblyHostBuilder.CreateDefault(args);
            webAssemblyHostBuilder.RootComponents.Add<App>("#app");
            webAssemblyHostBuilder.RootComponents.Add<HeadOutlet>("head::after");

            webAssemblyHostBuilder.Services.AddScoped(_ => new HttpClient
            {
                BaseAddress = new Uri(webAssemblyHostBuilder.HostEnvironment.BaseAddress)
            });

            await webAssemblyHostBuilder.Build().RunAsync();
        }
        
        #endregion
    }
}