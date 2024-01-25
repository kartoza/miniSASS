import os
import tensorflow as tf

class TensorFlowMemoryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.memory_limit_gb = float(os.environ.get("TF_MEMORY_LIMIT_GB", 0.5)) # Default to 0.5 GB

    def __call__(self, request):
        # Configure TensorFlow memory usage based on environment variable
        self.set_tensorflow_memory_limit()

        response = self.get_response(request)

        return response

    def set_tensorflow_memory_limit(self):
        config = tf.compat.v1.ConfigProto()
        config.gpu_options.per_process_gpu_memory_fraction = self.memory_limit_gb
        tf.compat.v1.Session(config=config)
