using System;
using System.Collections.Generic;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;

namespace Diggel.Logic.Seeding
{
    public class SeedTestSessions
    {
        public static (List<TestSession> testSessions, List<ItemResult> itemResponses, List<ItemLogRow> itemLogRows)
            GetTestSessions()
        {
            var itemResponses = new List<ItemResult>();
            var itemLogRows = new List<ItemLogRow>();
            var testSessions = new List<TestSession>();

            var now = DateTime.UtcNow;


            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("302209F9-9FFE-446C-A00C-8115C30908A1"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "1234",
                    Status = TestStatus.NotStarted
                });
            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("A579B8B7-B6DF-4F60-A1ED-7249D8ED00D0"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "START1",
                    Status = TestStatus.NotStarted
                });

            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "START2",
                    Status = TestStatus.Started,
                    TestModuleId = 1,
                    StartTimestamp = DateTime.Now,
                    Log = new List<SessionLogRow>
                    {
                        new SessionLogRow
                        {
                            Action = LogActions.SessionStarted,
                            Timestamp = now.AddSeconds(-10),
                            Content = string.Empty
                        }
                    }
                });
            itemResponses.Add(
                new ItemResult().Init(Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232"), "item1", "posttekst", "derp", 0)
              );

            itemLogRows.AddRange(
                new List<ItemLogRow>
                {
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = "zoekterm",
                        Content = "wat is het antwoord?",
                        Timestamp = now.AddSeconds(-2)
                    },
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("DAE185FF-5AF8-45D5-A86E-8151BDAA6232"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = "klik",
                        Content = "ad2",
                        Timestamp = now.AddSeconds(-1)
                    }
                }
            );
            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("0D0D50F3-C189-4666-9057-5CD00A96C3C3"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "START3",
                    TestModuleId = 2,
                    StartTimestamp = DateTime.Now.AddHours(1),
                    Status = TestStatus.Finished,
                    Log = new List<SessionLogRow>
                    {
                        new SessionLogRow
                        {
                            Action = LogActions.SessionStarted,
                            Timestamp = now.AddSeconds(-10),
                            Content = string.Empty
                        },
                        new SessionLogRow
                        {
                            Action = LogActions.SessionFinished,
                            Timestamp = now.AddMinutes(2),
                            Content = string.Empty
                        }
                    }
                });

            itemResponses.Add(
                    new ItemResult().Init(Guid.Parse("0D0D50F3-C189-4666-9057-5CD00A96C3C3"), "item1", "kortantwoord1", "herp", 1)
                );
            itemLogRows.AddRange(
                new List<ItemLogRow>
                {
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("0D0D50F3-C189-4666-9057-5CD00A96C3C3"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = LogActions.SearchTerm,
                        Content = "wat is het antwoord op item1?",
                        Timestamp = now.AddSeconds(-2)
                    },
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("0D0D50F3-C189-4666-9057-5CD00A96C3C3"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = LogActions.Click,
                        Content = "klik: ad1",
                        Timestamp = now.AddSeconds(-1)
                    }
                });
            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("1A4F65B7-049C-4229-9AC4-6B672AD5E939"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "ST3TJ93",
                    Status = TestStatus.Finished,
                    TestModuleId = 3,
                    StartTimestamp = DateTime.Now.AddHours(2),
                    Log = new List<SessionLogRow>
                    {
                        new SessionLogRow
                        {
                            Action = LogActions.SessionStarted,
                            Timestamp = now.AddSeconds(-10),
                            Content = string.Empty
                        },
                        new SessionLogRow
                        {
                            Action = LogActions.SessionFinished,
                            Timestamp = now.AddMinutes(2),
                            Content = string.Empty
                        }
                    }
                });
            var newResponse = new ItemResult().Init(Guid.Parse("1A4F65B7-049C-4229-9AC4-6B672AD5E939"), "item1", "kortantwoord1", "hoioi", 1);
            newResponse.ItemContext = "A";
            itemResponses.Add(newResponse);

            itemLogRows.AddRange(
                new List<ItemLogRow>
                {
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("1A4F65B7-049C-4229-9AC4-6B672AD5E939"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = LogActions.SearchTerm,
                        Content = "wat zou het zijn",
                        Timestamp = now.AddSeconds(-2)
                    },
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("1A4F65B7-049C-4229-9AC4-6B672AD5E939"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = LogActions.Click,
                        Content = "klik: ad2",
                        Timestamp = now.AddSeconds(-1)
                    }
                });

            testSessions.Add(
                new TestSession
                {
                    Id = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8"),
                    GroupId = Guid.Parse("0782E94F-77FD-429E-A735-39F43EDE7234"),
                    GroupName = "Groep Bonnefooi",
                    StartCode = "START4",
                    Status = TestStatus.Resumed,
                    TestModuleId = 4,
                    StartTimestamp = DateTime.Now.AddHours(3),
                    Log = new List<SessionLogRow>
                    {
                        new SessionLogRow
                        {
                            Action = LogActions.SessionStarted,
                            Timestamp = now.AddSeconds(-10),
                            Content = string.Empty
                        },
                        new SessionLogRow
                        {
                            Action = LogActions.SessionResumed,
                            Timestamp = now.AddMinutes(2),
                            Content = string.Empty
                        }
                    }
                });
            var newResponse2 = new ItemResult().Init(Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8"), "item1", "posttekst", "derp", 0);
            newResponse2.ItemContext = "A";
            itemResponses.Add(                newResponse2);

            itemLogRows.AddRange(
                new List<ItemLogRow>
                {
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = "zoekterm",
                        Content = "wat is het antwoord?",
                        Timestamp = now.AddSeconds(-2)
                    },
                    new ItemLogRow
                    {
                        TestSessionId = Guid.Parse("86F0EE4F-8768-4C7F-933E-8286A69686A8"),
                        ItemId = "item1",
                        ItemContext = "A",
                        Action = "klik",
                        Content = "ad2",
                        Timestamp = now.AddSeconds(-1)
                    }
                });

            return (testSessions, itemResponses, itemLogRows);
        }

    }
}