using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Citolab.Persistence;
using Citolab.Persistence.Extensions;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Notifications;
using Diggel.Logic.Seeding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;

namespace Diggel.Logic.NUnitTests
{
    [TestFixture]
    public class ItemLoggingTests
    {
        private IUnitOfWork _unitOfWork;
        private NotificationHandler _notificationHandler;
        private IServiceProvider _serviceProvider;

        [SetUp]
        public void Initialize()
        {
            IServiceCollection services = new ServiceCollection();
            services.AddInMemoryPersistence();
            services.AddLogging(builder =>
            {
                builder.AddConsole();
                builder.AddDebug();
            });
            services.AddRequests(Assembly.Load("Diggel.Logic"));
            _serviceProvider = services.BuildServiceProvider();

            // Seed the test data
            var unitOfWork = _serviceProvider.GetService<IUnitOfWork>();
            var loggerFactory = _serviceProvider.GetService<ILoggerFactory>();
            var seeder = new TestSeeder(unitOfWork, loggerFactory);
            seeder.SeedUnitTestSet();

            _unitOfWork = _serviceProvider.GetService<IUnitOfWork>();

            _notificationHandler = new NotificationHandler(_unitOfWork);
        }

        [Test]
        public async Task Seed_LogGoogleNavigation_CorrectLogRows()
        {
            // arrange
            // https://www.google.com/search?source=hp&ei=ALB3XITkFszVwQLQ5qqgAg&q=aap+rood+gezicht&btnK=Google+Search&oq=aap+rood+gezicht&gs_l=psy-ab.3..0i203j0i22i30.5624.10683..12563...4.0..0.177.1694.14j5......0....1..gws-wiz.....6..35i39j0j0i10i203j0i22i10i30.BRDPHHoCphg
            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var notification = new AddLogRowNotification
            {
                ItemId = "item1",
                LogAction = LogActions.Navigatie,
                LogText =
                    "https://www.google.com/search?source=hp&ei=ALB3XITkFszVwQLQ5qqgAg&q=aap+rood+gezicht&btnK=Google+Search&oq=aap+rood+gezicht&gs_l=psy-ab.3..0i203j0i22i30.5624.10683..12563...4.0..0.177.1694.14j5......0....1..gws-wiz.....6..35i39j0j0i10i203j0i22i10i30.BRDPHHoCphg",
                TestSessionId = testSessionId
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert
            var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();
            var logs =
                itemLogCollection.AsQueryable()
                    .Where(l => l.TestSessionId == testSessionId && l.ItemId == "item1").ToList();

            Assert.AreEqual(4, logs.Count);
            Assert.AreEqual(LogActions.Zoekterm, logs.Last().Action);
            Assert.AreEqual("aap rood gezicht", logs.Last().Content);
        }


        [Test]
        public async Task Seed_LogInteralNavigation_CorrectLogRows()
        {
            // arrange

            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var notification = new AddLogRowNotification
            {
                ItemId = "item1",
                LogAction = LogActions.Navigatie,
                LogText =
                    "https://citolab-diggel2.azurewebsites.net/search?q=space+walkers",
                TestSessionId = testSessionId
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert
            var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();
            var logs =
                itemLogCollection.AsQueryable()
                    .Where(l => l.TestSessionId == testSessionId && l.ItemId == "item1").ToList();

            Assert.AreEqual(4, logs.Count);
            Assert.AreEqual(LogActions.Zoekterm, logs.Last().Action);
            Assert.AreEqual("space walkers", logs.Last().Content);
        }

        [Test]
        public async Task Seed_LogInteralNavigationWhatsapp_CorrectLogRows()
        {
            // arrange

            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var notification = new AddLogRowNotification
            {
                ItemId = "item99",
                LogAction = LogActions.Navigatie,
                LogText =
                    "https://www.google.com/search?source=hp&ei=IPf2X_mTFIv2kwWj8rmIAw&q=whatsapp+privacy+optie&oq=whatsapp+privacy+optie&gs_lcp=ChFtb2JpbGUtZ3dzLXdpei1ocBADMgUIIRCgATIFCCEQoAE6AggAOggIABCxAxCDAToFCAAQsQM6CAguELEDEIMBOgUILhCxAzoICAAQxwEQrwE6BAgAEAo6AgguOgcIABCxAxAKOgYIABAKEAM6BAgAEAM6BggAEBYQHjoECAAQEzoICAAQFhAeEBM6CAghEBYQHRAeUO8UWM-DAWDClwFoA3AAeACAAcMBiAHOEJIBBDE5LjaYAQCgAQGwAQA&sclient=mobile-gws-wiz-hp",
                TestSessionId = testSessionId
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert
            var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();
            var logs =
                itemLogCollection.AsQueryable()
                    .Where(l => l.TestSessionId == testSessionId && l.ItemId == "item99").ToList();

            Assert.AreEqual(LogActions.Zoekterm, logs.Last().Action);
            Assert.AreEqual("whatsapp privacy optie", logs.Last().Content);
        }

        // 


        [Test]
        public async Task Seed_LogGoogleMapsRoute_CorrectLogRows()
        {
            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var notification = new AddLogRowNotification
            {
                ItemId = "item1",
                LogAction = LogActions.Navigatie,
                LogText =
                    "https://www.google.nl/maps/dir/Enschede/Deventer/Amsterdam/@52.264905,5.3382144,9z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x47b8139482fe5187:0xd24e1fb7ad7265e2!2m2!1d6.8936619!2d52.2215372!1m5!1m1!1s0x47c7ebc9af5d5611:0xc1a40d18d98571e3!2m2!1d6.1552165!2d52.2660751!1m5!1m1!1s0x47c63fb5949a7755:0x6600fd4cb7c0af8d!2m2!1d4.9035614!2d52.3679843!3e0",
                TestSessionId = testSessionId
            };

            // act
            await _notificationHandler.Handle(notification);

            //_unitOfWork.Commit();
            //_unitOfWork = _serviceProvider.GetService<IUnitOfWork>();

            // assert
            var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();
            var logs =
                itemLogCollection.AsQueryable()
                    .Where(l => l.TestSessionId == testSessionId && l.ItemId == "item1").ToList();

            Assert.AreEqual(4, logs.Count);
            Assert.AreEqual(LogActions.MapsRoute, logs.Last().Action);
            Assert.AreEqual("Enschede,Deventer,Amsterdam", logs.Last().Content);
        }


        //[Test]
        //public async Task Seed_AddAapItemResponse_CorrectLogRow()
        //{
        //    // arrange
        //    var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
        //    var notification = new AddItemResultNotification
        //    {
        //        ItemResult = new ItemResult().Init(testSessionId, "aap", "aap", "dat is een Oekari volgens mij", 1)
        //    };

        //    // act
        //    await _notificationHandler.Handle(notification);

        //    // assert
        //    var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();
        //    var logs =
        //        itemLogCollection.AsQueryable()
        //            .Where(l => l.TestSessionId == testSessionId && l.ItemId == "aap").ToList();
        //    Assert.AreEqual(1, logs.Count);
        //    Assert.AreEqual(LogActions.Levenshtein, logs.Last().Action);
        //    // correctanswer:(minimum distance words found in response)
        //    Assert.AreEqual("oeakari:(Oekari:1),uakari:(Oekari:2),uacari:(Oekari:3)", logs.Last().Content);
        //}
    }
}