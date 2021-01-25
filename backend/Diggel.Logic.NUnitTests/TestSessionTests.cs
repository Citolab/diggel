using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Citolab.Persistence;
using Citolab.Persistence.Extensions;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Commands;
using Diggel.Logic.Requests.Notifications;
using Diggel.Logic.Requests.Queries;
using Diggel.Logic.Seeding;
using Diggel.Logic.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;

namespace Diggel.Logic.NUnitTests
{
    [TestFixture]
    public class TestSessionTests
    {
        private IUnitOfWork _unitOfWork;
        private QueryHandler _queryHandler;
        private NotificationHandler _notificationHandler;
        private CommandHandler _commandHandler;

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
            var serviceProvider = services.BuildServiceProvider();

            // Seed the test data
            var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
            var loggerFactory = serviceProvider.GetService<ILoggerFactory>();
            var seeder = new TestSeeder(unitOfWork, loggerFactory);
            seeder.SeedUnitTestSet();

            _unitOfWork = serviceProvider.GetService<IUnitOfWork>();

            _queryHandler = new QueryHandler(_unitOfWork);
            _notificationHandler = new NotificationHandler(_unitOfWork);
            _commandHandler = new CommandHandler(_unitOfWork);
        }

        [Test]
        public async Task Seed_TestSessionQuery_ReturnsViewModel()
        {
            // arrange
            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var query = new TestSessionQuery { TestSessionId = testSessionId };
            // act
            var viewModel = await _queryHandler.Handle(query);

            // assert
            Assert.IsNotNull(viewModel);
        }

        [Test]
        public async Task Seed_AddItemResponse_ItemResponseAddedWithEmoji()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "itemAap", "posttekst", "??????????😂", 0)
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert          
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "itemAap");
            var interactionResult = itemResponse.GetInteractionResults().FirstOrDefault();
            Assert.IsNotNull(interactionResult);
            Assert.AreEqual(0, interactionResult.Score);
            Assert.AreEqual("??????????😂", interactionResult.Value);
        }

        [Test]
        public async Task Seed_AddItemResponse_ItemResponseEmpty()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "itemAap", "posttekst", string.Empty, 0)
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert          
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "itemAap");
            var interactionResult = itemResponse.GetInteractionResults().FirstOrDefault();
            Assert.IsNotNull(interactionResult);
            Assert.AreEqual(0, interactionResult.Score);
            Assert.AreEqual("", interactionResult.Value);
        }

        [Test]
        public async Task Seed_AddItemResponse_ItemResponseAddedWithoutEmoji()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "itemAap", "posttekst", "?????????", 0)
            };


            // act
            await _notificationHandler.Handle(notification);

            // assert          
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "itemAap");
            var interactionResult = itemResponse.GetInteractionResults().FirstOrDefault();
            Assert.IsNotNull(interactionResult);
            Assert.AreEqual(0, interactionResult.Score);
            Assert.AreEqual("?????????", interactionResult.Value);
        }

        [Test]
        public async Task Seed_StartTestSessionThatIsNotStarted_SessionHasCorrectStatus()
        {
            // arrange
            var command = new StartTestSessionWithStartCodeCommand
            {
                StartCode = "START1"
            };

            // act
            var viewModel = await _commandHandler.Handle(command);

            // assert
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(viewModel.Id);

            var candidateSessionsCollection = _unitOfWork.GetCollection<CandidateSessions>();
            var candidateSessions = await candidateSessionsCollection.GetAsync(testSession.CandidateSessionsId);

            Assert.AreEqual(TestStatus.Started, testSession.Status);
            Assert.AreEqual(TestStatus.Started, candidateSessions.Status);
        }

        [Test]
        public async Task Seed_StartTestSessionThatIsStarted_SessionIsResumed()
        {
            // arrange
            var command = new StartTestSessionWithStartCodeCommand
            {
                StartCode = "START2"
            };

            // act
            var viewModel = await _commandHandler.Handle(command);

            // assert
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(viewModel.Id);
            var candidateSessionsCollection = _unitOfWork.GetCollection<CandidateSessions>();
            var candidateSessions = await candidateSessionsCollection.GetAsync(testSession.CandidateSessionsId);
            Assert.AreEqual(TestStatus.Resumed, testSession.Status);
            Assert.AreEqual(TestStatus.Resumed, candidateSessions.Status);
        }

        [Test]
        public void Seed_StartTestSessionThatHasFinished_ThrowsCorrectException()
        {
            // arrange
            var command = new StartTestSessionWithStartCodeCommand
            {
                StartCode = "START3" // testsession that has finished
            };

            // act & assert            
            var exception = Assert.ThrowsAsync<DomainException>(() => _commandHandler.Handle(command));
            Assert.That(exception.Message, Is.EqualTo("Invalid startcode or test session has finished."));
        }

        [Test]
        public async Task Seed_FinishTestSessionThatIsStarted_SessionHasCorrectStatus()
        {
            // arrange
            var testSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232");
            var command = new FinishTestSessionCommand
            {
                TestSessionId = testSessionId
            };

            // act
            await _commandHandler.Handle(command);

            // assert
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(testSessionId);

            Assert.AreEqual(TestStatus.Finished, testSession.Status);
        }

        [Test]
        public async Task Seed_FinishTestSessionThatIsResumed_SessionHasCorrectStatus()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var command = new FinishTestSessionCommand
            {
                TestSessionId = testSessionId
            };

            // act
            await _commandHandler.Handle(command);

            // assert
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(testSessionId);

            var candidateSessionsCollection = _unitOfWork.GetCollection<CandidateSessions>();
            var candidateSessions = await candidateSessionsCollection.GetAsync(testSession.CandidateSessionsId);

            Assert.AreEqual(TestStatus.Finished, testSession.Status);
            Assert.AreEqual(TestStatus.Finished, candidateSessions.Status);
        }

        [Test]
        public async Task Seed_AddItemResponse_ItemResponseAdded()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");

            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "item2", "posttekst", "hopseflops", 1)
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert          
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "item2");
            var interactionResult = itemResponse.GetInteractionResults().FirstOrDefault();
            Assert.IsNotNull(interactionResult);
            Assert.AreEqual(1, interactionResult.Score);
            Assert.AreEqual("hopseflops", interactionResult.Value);
        }

        [Test]
        public async Task Seed_AddItemResponse_ItemResponseAdded_SerializeTest()
        {
            // arrange
            var testSession = _unitOfWork.GetCollection<TestSession>().FirstOrDefaultAsync().Result;
            var testSessionId = testSession.Id;
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "item2", "posttekst", "hopseflops", 1)
            };
            // act
            await _notificationHandler.Handle(notification);

            // assert          
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponses =
                itemResponseCollection
                .AsQueryable()
                .Where(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "item2")
                .ToList();

            var testSessionViewModel = new TestSessionViewModel(testSession, itemResponses);
            Assert.IsTrue(testSessionViewModel.ItemResults.Count > 0, "Test before serialization.");
            var viewModelString = JsonSerializer.Serialize(testSessionViewModel);
            testSessionViewModel = JsonSerializer.Deserialize<TestSessionViewModel>(viewModelString);
            Assert.IsTrue(testSessionViewModel.ItemResults.Count > 0, "Test after serialization.");
        }

        [Test]
        public async Task Seed_ReplaceItemResponse_ItemResponseIsNotDuplicated()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "item1", "posttekst", "hopseflops", 1)
            };
            // act
            await _notificationHandler.Handle(notification);

            // assert
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponses =
                itemResponseCollection.AsQueryable()
                    .Where(r => r.TestSessionId == testSessionId &&
                                r.Identifier == "item1" )
                    .ToList();

            Assert.AreEqual(1, itemResponses.Count);
        }

        [Test]
        public async Task Seed_ReplaceItemResponse_ItemResponseReplaced()
        {
            // arrange
            var testSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8");
            var notification = new AddItemResultNotification
            {
                ItemResult = new ItemResult().Init(testSessionId, "item1", "posttekst", "hopseflops", 1)
            };

            // act
            await _notificationHandler.Handle(notification);

            // assert
            var itemResponseCollection = _unitOfWork.GetCollection<Models.ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == testSessionId && r.Identifier == "item1");
            var interactionResult = itemResponse.GetInteractionResults()
                .Where(i => i.Identifier == "posttekst").FirstOrDefault();
            Assert.AreEqual(1, interactionResult.Score);
            Assert.AreEqual("hopseflops", interactionResult.Value);
        }
    }
}