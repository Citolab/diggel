using System;
using System.Collections.Generic;
using System.Linq;
using Citolab.Persistence;
using Diggel.Logic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Diggel.Backend.Helpers
{
    public class DomainExceptionFilter : ExceptionFilterAttribute
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public DomainExceptionFilter(ILoggerFactory loggerFactory, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _logger = loggerFactory.CreateLogger<DomainExceptionFilter>();
        }

        public override void OnException(ExceptionContext context)
        {
            var domainExceptions = new List<DomainException>();
            if (context.Exception is DomainException)
            {
                domainExceptions.Add((DomainException) context.Exception);
            }

            if (context.Exception is AggregateException exception)
            {
                domainExceptions.AddRange(exception.InnerExceptions
                    .OfType<DomainException>().ToList());
            }

            if (domainExceptions.Any())
            {
                var messages = domainExceptions.Select(e => new {e.ErrorCode, e.Message});
                var badRequest = domainExceptions.Any(e => e.IsBadRequest);
                foreach (var domainException in domainExceptions)
                {
                    _logger.LogWarning(0,
                        $"A domain exception (${domainException.ErrorCode}) was thrown: {domainException.Message}. The request that caused it was {(domainException.IsBadRequest ? "malformed" : "not malformed")}",
                        domainException);
                }

                if (badRequest)
                {
                    context.Result = new BadRequestObjectResult(messages);
                }
                else
                {
                    context.Result = new NotFoundObjectResult(messages);
                }
            }
            base.OnException(context);
        }
    }
}