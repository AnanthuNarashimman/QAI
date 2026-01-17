import collections

# Dictionary to represent page
site_graph = {'page_0':['page_1', 'page_2']}

def bfs_crawler(site_graph, start_page):
    visited = set()

    queue = collections.deque([start_page])

    while queue:
        page = queue.popleft()
        # Analyze the page
        # In case new links are found in the 'page' update the site_graph accordingly
        visited.add(page)

        for neighbor in site_graph[page]:
            if neighbor not in visited:
                queue.append(neighbor)

    print(visited)

bfs_crawler(site_graph, 'page_0')