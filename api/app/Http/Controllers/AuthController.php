<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request){
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8'],

        ]);
        $user = User::create($validated);

        $token = $user->createToken('mobile')->plainTextToken;

        return [
              'user' => $user,
              'token' => $token,
        ];
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if(! $user || ! Hash::check($request->password, $user->password) ){
            return response()->json(['message' => 'wrong email or password'], 401);
        }

        $token = $user->createToken('mobile')->plainTextToken;
        return[
            'user' => $user,
            'token' => $token,
        ];

    }

    public function logout(Request $request) {

    $request->user()->currentAccessToken()->delete();
       return response()->json(['message' => 'logged out']);

    }
}
