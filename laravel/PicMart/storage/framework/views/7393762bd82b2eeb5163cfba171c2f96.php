<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PicMart</title>
    <link rel="stylesheet" href="<?php echo e(asset('assets/css/bootstrap.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/js/dropzone.min.js')); ?>">
    <meta name="_token" content="<?php echo e(csrf_token()); ?>">
</head>
<body>
    <div class="bg-primary">
        <div class= "container py-3">
            <h1 class="text-white">Laravel 10 Multiple Image Uploads</h1>
    </div> 
</div>
<div class="py-5">
    <div class="container">
    <form action="">
        <div class="card border-0 shadow-lg">
            <div class="card-body">
                    <div class="row">
                        <h2 class="pb-3">Create Product</h2>
                        <div class="col-md-6">
                            <div class ="mb-3">
                            <input type="text" name="name" id="name" value="" placeholder="Name" class="form-control">
                            </div>
                        </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                        <input type="text" name="price" id="price" value="" placeholder="Price" class="form-control">
                        <div>
                    </div>
                <div class="col-md-6">
                <h2 class="pb-3 mt-3">Upload Image</h2>
                    <div class="mb-3">
                    <div id="image" class="dropzone dz-clickable">
                    <div class="dz-message needsclick">    
                    <br>Drop files here or click to upload.<br><br>                                            
                </div>
            </div>
        </div>
    </div>
</div>
   </div>
        </div>
        <div class="my-3">
            <button type="submit" class="btn btn-primary btn">Create</button>
        </div>
            </form>
                </div>
                    </div>

</body>
<script src="<?php echo e(asset('assets/js/jquery-3.6.4.min.js')); ?>"></script>
<script src="<?php echo e(asset('assets/js/dropzone.min.js')); ?>"></script>
<script type="text/javascript">
    Dropzone.autoDiscover = false;    
  const dropzone = $("#image").dropzone({ 
			uploadprogress: function(file, progress, bytesSent) {
          $("button[type=submit]").prop('disabled',true);
      },
      url:  "<?php echo e(route('temp-images.create')); ?>",
      maxFiles: 10,
      paramName: 'image',
      addRemoveLinks: true,
      acceptedFiles: "image/jpeg,image/png,image/gif",
      headers: {
          'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
      }, success: function(file, response){
          $("#image_id").val(response.image_id);
          this.removeFile(file);            
      }
  });

</script>
</html>
<?php /**PATH C:\xampp\htdocs\laravel\PicMart\resources\views/products/create.blade.php ENDPATH**/ ?>