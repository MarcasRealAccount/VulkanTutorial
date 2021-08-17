#include <stdint.h>
#include <vulkan/vulkan.h>

VkInstance instance; /* Handle to a vulkan instance */

const char* applicationName = "Vulkan Application"; /* The name of the application */
uint32_t applicationVersion = VK_MAKE_API_VERSION(0 /* Required: Variant */, 1 /* Required: Major */, 2 /* Required: Minor */, 3 /* Required: Patch */); /* The version of the application */
const char* engineName = "Vulkan Application Engine"; /* The name of the engine */
uint32_t engineVersion = VK_MAKE_API_VERSION(0 /* Required: Variant */, 1 /* Required: Major */, 2 /* Required: Minor */, 3 /* Required: Patch */); /* The version of the engine */
uint32_t instanceLayerCount = 0; /* Number of used instance layers */
const char* const* instanceLayers = NULL; /* The names of the used instance layers */
uint32_t instanceExtensionCount = 0; /* Number of used instance extensions */
const char* const* instanceExtensions = NULL; /* The names of the used instance extensions */

VkApplicationInfo appInfo;
appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO; /* Required: The type of this structure */
appInfo.pNext = NULL; /* Optional: Pointer to next structure */
appInfo.pApplicationName = applicationName; /* Optional: The name of the application */
appInfo.applicationVersion = applicationVersion; /* Optional: The version of the application */
appInfo.pEngineName = engineName; /* Optional: The name of the engine */
appInfo.engineVersion = engineVersion; /* Optional: The version of the engine */
appInfo.apiVersion = VK_API_VERSION_1_0; /* Required: The highest version of vulkan used by this application */

VkInstanceCreateInfo createInfo;
createInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO; /* Required: The type of this structure */
createInfo.pNext = NULL; /* Optional: Pointer to next structure */
createInfo.flags = 0; /* Optional: Flags for this structure */
createInfo.pApplicationInfo = &appInfo; /* Optional: Pointer to a VkApplicationInfo structure */
createInfo.enabledLayerCount = instanceLayerCount; /* Optional: Number of used instance layers */
createInfo.ppEnabledLayerNames = instanceLayers; /* Optional: The names of the used instance layers */
createInfo.enabledExtensionCount = instanceExtensionCount; /* Optional: Number of used instance extensions */
createInfo.ppEnabledExtensionNames = instanceExtensions; /* Optional: The names of the used instance extensions */

VkAllocationCallbacks allocatorCallbacks;
allocatorCallbacks.pUserData = NULL; /* Optional: Pointer to user data */
allocatorCallbacks.pfnAllocation = &allocationFunc; /* Required: Allocation function pointer 'void* (VKAPI_PTR *)(void* pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)' */
allocatorCallbacks.pfnReallocation = &reallocationFunc; /* Required: Reallocation function pointer 'void* (VKAPI_PTR *)(void* pUserData, void* pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)' */
allocatorCallbacks.pfnFree = &freeFunc; /* Required: Free function pointer 'void (VKAPI_PTR *)(void* pUserData, void* pMemory)' */
allocatorCallbacks.pfnInternalAllocation = &internalAllocationFunc; /* Optional if pfnInternalFree is NULL: Internal allocation function pointer 'void (VKAPI_PTR *)(void* pUserData, size_t size, VkInternalAllocationType allocationType, VkSystemAllocationScope allocationScope)' */
allocatorCallbacks.pfnInternalFree = &internalFreeFunc; /* Optional if pfnInternalAllocation is NULL: Internal free function pointer 'void (VKAPI_PTR *)(void* pUserData, size_t size, VkInternalAllocationType allocationType, VkSystemAllocationScope allocationScope' */

if (vkCreateInstance(&createInfo /* pCreateInfo */, &allocatorCallback /* Optional: pAllocator */, &instance /* pInstance */) != VK_SUCCESS) {
	/* vkCreateInstance succeed in creating a vulkan instance handle */
}