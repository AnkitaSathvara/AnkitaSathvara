<?php

namespace App\Http\Controllers;

use App\Models\TempImage;
use Illuminate\Http\Request;

class TempImageController extends Controller
{
    public function store(Request $request){
        if(!empty($request->image)){
        $image = $request->image;
        $ext = $image->getClientOriginalExtention();

        $tempImage = new TempImage();
        $tempImage->name = 'null';
        $tempImage->save();

        $ImageName = $tempImage->id.'.'.$ext;

        $tempImage->name = $imageName;
        $tempImage->save();

        $image->move(public_path('upoads/temp/'),$ImageName);

        return response()->json([
            'status' => true,
            'image_id' => $tempImage->id,
            'name' => $imageName,
        ]);
    }
  }
}