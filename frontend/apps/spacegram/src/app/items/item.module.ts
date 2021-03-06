import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxEventHandlerModule } from 'ngx-event-handler';
import { UiModule } from '@diggel/ui';
import { ItemHeaderComponent } from './components/item-header/item-header.component';
import { PostReactionComponent } from './components/post-reaction/post-reaction.component';
import { LikeInteractionComponent } from './components/like-interaction/like-interaction.component';
import { TranslateModule } from '@ngx-translate/core';

// items
import { WelcomeSpacegramComponent } from './welcome-spacegram/welcome-spacegram.component';
import { TangareItemComponent } from './tangare/tangare.component';
import { FunnyVideoItemComponent } from './funny-video/funny-video.component';
import { TieItemComponent } from './tie/tie.component';
import { WorkflowItemComponent } from './workflow/workflow.component';
import { NewsItemComponent } from './news/news.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DragDropModule,
    NgbTooltipModule,
    NgxEventHandlerModule,
    TranslateModule,
    UiModule,
  ],
  declarations: [
    ItemHeaderComponent,
    PostReactionComponent,
    LikeInteractionComponent,
    WelcomeSpacegramComponent,
    TangareItemComponent,
    WorkflowItemComponent,
    FunnyVideoItemComponent,
    TieItemComponent,
    NewsItemComponent
  ],
  entryComponents: [],
  exports: [],
})
export class ItemModule { }
