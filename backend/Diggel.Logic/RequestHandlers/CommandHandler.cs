using System;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.Models;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Commands;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.RequestHandlers
{
    public class CommandHandler : IHandleCommand<AddGroupCommand, Group>,
        IHandleCommand<StartTestSessionWithStartCodeCommand, TestSessionViewModel>,
        IHandleCommand<LoginCommand, LoginResult>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<Group> Handle(AddGroupCommand command)
        {
            return command.Execute(_unitOfWork);
        }

        public Task<TestSessionViewModel> Handle(StartTestSessionWithStartCodeCommand command)
        {
            return command.Execute(_unitOfWork);
        }

        public Task<FinishTestSessionResult> Handle(FinishTestSessionCommand command)
        {
            return command.Execute(_unitOfWork);
        }

        public Task<LoginResult> Handle(LoginCommand command)
        {
            return command.Execute(_unitOfWork);
        }
    }
}