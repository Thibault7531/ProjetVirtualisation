import csv
import sys

filename = sys.argv[1] if len(sys.argv) > 1 else 'results.csv'

start_time = float('inf')
with open(filename, mode='r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        ts = int(row['timeStamp'])
        if ts < start_time:
            start_time = ts

cuttoff_time = start_time + 10000

total_requests = 0
failures = 0
total_elapsed_time = 0
response_times = []
min_time = float('inf')
max_time = float(0)
end_time = float(0)

with open(filename, 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        ts = int(row['timeStamp'])
        if ts < cuttoff_time:
            continue

        total_requests += 1

        success = row['success'].lower() == 'true' or row['responseCode'] == '401'
        if not success:
            failures += 1

        elapsed = int(row['elapsed'])
        total_elapsed_time += elapsed
        response_times.append(elapsed)
        if elapsed < min_time:
            min_time = elapsed
        if elapsed > max_time:
            max_time = elapsed

        if ts > end_time:
            end_time = ts

duration_seconds = (end_time - cuttoff_time) / 1000
throughput = total_requests / duration_seconds
error_rate = (failures / total_requests) * 100

response_times.sort()
median_response_time = response_times[len(response_times) // 2]
p90 = response_times[int(len(response_times) * 0.9)]
p95 = response_times[int(len(response_times) * 0.95)]
p99 = response_times[int(len(response_times) * 0.99)]

print(f"--- JMeter Test Results Summary ---")
print(f"Total Requests: {total_requests}")
print(f"Duration: {duration_seconds:.2f} seconds")
print(f"Throughput: {throughput:.2f} req/sec")
print(f"Error Rate: {error_rate:.2f}% ({failures} failures)")
print(f"Median Response Time: {median_response_time:.2f} ms")
print(f"90th Percentile (p90): {p90} ms")
print(f"90th Percentile (p90): {p95} ms")
print(f"90th Percentile (p90): {p99} ms")
print(f"Min / Max: {min_time} ms / {max_time} ms")