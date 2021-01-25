using System.Linq;
using System.Reflection;
using Citolab.Persistence;
using Citolab.Persistence.Extensions;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Diggel.Logic.Seeding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;

namespace Diggel.Logic.NUnitTests
{
    [TestFixture]
    public class GroupTests
    {
        private IUnitOfWork _unitOfWork;

        [SetUp]
        public void SetUp()
        {
            IServiceCollection services = new ServiceCollection();
            services.AddInMemoryPersistence();
            services.AddLogging(builder =>
            {
                builder.AddConsole();
                builder.AddDebug();
            });
            services.AddRequests(Assembly.Load("Diggel.Logic"));
            var serviceProvider = services.BuildServiceProvider();

            // Seed the test data
            var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
            var loggerFactory = serviceProvider.GetService<ILoggerFactory>();
            var seeder = new TestSeeder(unitOfWork, loggerFactory);
            seeder.SeedUnitTestSet();

            _unitOfWork = serviceProvider.GetService<IUnitOfWork>();
        }

        [Test]
        public void Seed_HasThreeGroups()
        {
            // arrange
            var groupCollection = _unitOfWork.GetCollection<Group>();

            // act
            var numberOfGroups = groupCollection.GetCountAsync().Result;

            // assert
            Assert.AreEqual(4, numberOfGroups);
        }

        [Test]
        public void Seed_GroupBonnefooiHasThreeTestSessions()
        {
            // arrange
            var groupCollection = _unitOfWork.GetCollection<Group>();
            var bonnefooi = groupCollection.AsQueryable().FirstOrDefault(g => g.Name == "Groep Bonnefooi");

            // act
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var testSessions = testSessionCollection.AsQueryable().Where(s => s.GroupId == bonnefooi.Id).ToList();

            // assert
            Assert.AreEqual(6, testSessions.Count);
        }
    }
}