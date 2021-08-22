#include <stdint.h>

VkInstance instance;

VkPhysicalDevice physicalDevice = VK_NULL_HANDLE;

uint32_t physicalDeviceCount;
vkEnumeratePhysicalDevices(instance, &physicalDeviceCount, NULL);
VkPhysicalDevice* physicalDevices = (VkPhysicalDevice*)malloc(sizeof(VkPhysicalDevice) * physicalDeviceCount);
vkEnumeratePhysicalDevices(instance, &physicalDeviceCount, physicalDevices);

for (uint32_t i = 0; i < physicalDeviceCount; ++i) {
	VkPhysicalDevice currentPhysicalDevice = physicalDevices[i];

	VkPhysicalDeviceProperties deviceProperties;
	VkPhysicalDeviceFeatures deviceFeatures;
	vkGetPhysicalDeviceProperties(currentPhysicalDevice, &deviceProperties);
	vkGetPhysicalDeviceFeatures(currentPhysicalDevice, &deviceFeatures);

	if (deviceProperties.deviceType == VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU) {
		physicalDevice = currentPhysicalDevice;
		break;
	}
}

free(physicalDevices);