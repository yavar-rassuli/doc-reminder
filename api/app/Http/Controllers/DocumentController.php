<?php

namespace App\Http\Controllers;
use App\Models\Document;

use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->documents()->orderby('expires_at')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validated = $request->validate([
        'name' => ['required'],
        'type' => ['required'],
        'expires_at' => ['required', 'date'],
        'remind_days_before' => ['nullable', 'integer'],
        'photo' => ['nullable', 'image', 'max:5120'],
       ]);

       if($request->hasFile('photo')){
        $path = $request->file('photo')->store('photos','public');
      
        $validated['photo_path'] =  $path; 

       }

       $document = $request->user()->documents()->create($validated);


       return response()->json($document,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
       $document = Document::findOrFail($id);
      
       if( $document->user_id !==  $request->user()->id){
        return response()->json(['message' =>'Forbiden'], 403);
       }else{
          return response()->json( $document);
       }
     


    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $document = Document::findOrFail($id);
         if( $document->user_id !== $request->user()->id){
            return response()->json(['message' => 'forbiden'], 403);
         }else{
            $validated = $request->validate([
                'name' => ['sometimes'],
                'type' => ['sometimes'],
                'expires_at' => ['sometimes', 'date'],
                'remind_days_before' => ['nullable', 'integer'],
            ]);

             $document->update($validated);
             return response()->json($document);
         }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $document = Document::findOrFail($id);
        if ($document->user_id !== $request->user()->id){
            return response()->json(['message' => 'forbiden'], 403);
        }else{
            $document->delete();
            return response()->json(['message' => 'Document deleted']);
        }
    }
}

