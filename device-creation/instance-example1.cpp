#include <cstdint>
#include <string>
#include <vector>
#include <vulkan.hpp>

std::string applicationName = "Vulkan Application"; /* The name of the application */
std::uint32_t applicationVersion = VK_MAKE_API_VERSION(0 /* Required: Variant */, 1 /* Required: Major */, 2 /* Required: Minor */, 3 /* Required: Patch */); /* The version of the application */
std::string engineName = "Vulkan Application Engine"; /* The name of the engine */
std::uint32_t engineVersion = VK_MAKE_API_VERSION(0 /* Required: Variant */, 1 /* Required: Major */, 2 /* Required: Minor */, 3 /* Required: Patch */); /* The version of the engine */
std::vector<const char*> instanceLayers; /* The names of the used instance layers */
std::vector<const char*> instanceExtensions; /* The names of the used instance extensions */

vk::ApplicationInfo appInfo = { applicationName.c_str() /* Optional: The name of the application */ , applicationVersion /* Optional: The version of the application */, engineName.c_str() /* Optional: The name of the engine */, engineVersion /* Optional: The version of the engine */, VK_API_VERSION_1_0 /* Required: The highest version of vulkan used by this application */ };

vk::InstanceCreateInfo createInfo = { {} /* Optional: Flags for this structure */, &appInfo /* Optional: Pointer to a vk::ApplicationInfo structure */, instanceLayers /* Optional: The names of the used instance layers */, instanceExtensions /* Optional: The names of the used instance extensions */};

vk::AllocationCallbacks allocatorCallbacks = {};

vk::Instance instance = vk::createInstance(createInfo /* Required: createInfo */, allocatorCallbacks /* Optional: allocator */);