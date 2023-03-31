cmake_minimum_required(VERSION 3.20)

project(vi-rt)

set(CMAKE_EXPORT_COMPILE_COMMANDS On)
set(CXX_STANDARD C++20)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20")

file(GLOB_RECURSE sources src/**/*.cpp src/*.cpp include/*.hpp)

add_subdirectory(vendor/fmt)
add_subdirectory(vendor/tinyobjloader)
add_subdirectory(vendor/miniz)
add_subdirectory(vendor/glm)

add_compile_definitions(SPNG_USE_MINIZ)

add_executable(vi-rt ${sources}
        vendor/libspng/spng/spng.c)

target_link_libraries(vi-rt fmt::fmt)
target_link_libraries(vi-rt tinyobjloader)
target_link_libraries(vi-rt miniz)
target_link_libraries(vi-rt glm)
target_link_libraries(vi-rt m)

target_include_directories(vi-rt PRIVATE src include)
target_include_directories(vi-rt PRIVATE vendor/libspng)

