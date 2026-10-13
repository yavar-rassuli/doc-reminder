<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Document;
use Illuminate\Support\Facades\Mail;


#[Signature('documents:remind')]
#[Description('Send email reminders for documents that expire soon')]
class SendDocumentReminders extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
     
       $documents = Document::all();

       foreach($documents as $document){
        $this->info($document->name);
        $remindDate  = $document->expires_at->subDays($document->remind_days_before);
            $this->info($remindDate);
            if($remindDate->istoday()){
                  Mail::raw( "Your document " . $document->name . " expire soon" , fn ($message) => $message->to($document->user->email)->subject( 'Document reminder' ) );
            }
       }

    }
}
