import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, HelperText, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { usePromptStore } from '@/stores/promptStore';

const VISIBILITY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '公开', value: 'public' },
  { label: '私有', value: 'private' },
  { label: '系统', value: 'system' },
];

const ACCESS_LEVEL_OPTIONS = [
  { label: '全部角色', value: '' },
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '普通用户', value: 'user' },
];

const SORT_OPTIONS = [
  { label: '最新', value: 'recent' },
  { label: '热门', value: 'popular' },
  { label: '成功率', value: 'success' },
];

export function PromptLibraryScreen() {
  const { prompts, fetchPrompts, isLoading, error, filters } = usePromptStore();
  const [tagSearch, setTagSearch] = useState('');
  const [category, setCategory] = useState(filters.category ?? '');

  const parsedTags = useMemo(
    () =>
      tagSearch
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagSearch],
  );

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const onApplyFilters = () => {
    fetchPrompts({
      category: category || undefined,
      tags: parsedTags,
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium">提示词库</Text>
        <Text variant="bodyMedium" style={styles.subheading}>
          根据角色与标签筛选提示词模板，快速找到合适的链式编辑提示。
        </Text>

        <View style={styles.filters}>
          <TextInput
            mode="outlined"
            label="分类"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="标签（逗号分隔）"
            value={tagSearch}
            onChangeText={setTagSearch}
            style={styles.input}
          />

          <View style={styles.chipRow}>
            {VISIBILITY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={
                  (filters.visibility === option.value && option.value !== '') ||
                  (!filters.visibility && option.value === '')
                }
                onPress={() => fetchPrompts({ visibility: option.value || undefined })}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <View style={styles.chipRow}>
            {ACCESS_LEVEL_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={
                  (filters.accessLevel === option.value && option.value !== '') ||
                  (!filters.accessLevel && option.value === '')
                }
                onPress={() => fetchPrompts({ accessLevel: option.value || undefined })}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <View style={styles.chipRow}>
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={filters.sort === option.value}
                onPress={() => fetchPrompts({ sort: option.value as typeof filters.sort })}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <Button mode="contained-tonal" onPress={onApplyFilters} style={styles.applyButton}>
            应用过滤
          </Button>
        </View>

        {error ? <HelperText type="error">加载失败：{error}</HelperText> : null}
      </View>

      {isLoading && prompts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={prompts}
          keyExtractor={(item) => item.promptId}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => fetchPrompts()} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{item.name}</Text>
                <Chip mode="outlined" compact>
                  {item.category}
                </Chip>
              </View>
              <Text style={styles.metaText}>可见性：{item.visibility}</Text>
              <Text style={styles.metaText}>角色：{item.accessLevel.join(', ')}</Text>
              <View style={styles.statistics}>
                <Chip icon="fire" compact>
                  使用次数 {item.usageCount}
                </Chip>
                <Chip icon="chart-line" compact>
                  成功率 {(item.successRate * 100).toFixed(0)}%
                </Chip>
              </View>
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <Chip key={tag} compact mode="outlined">
                    #{tag}
                  </Chip>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge">提示词列表为空，请调整筛选条件。</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 16,
  },
  subheading: {
    color: '#6B7280',
  },
  filters: {
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  applyButton: {
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: '#4B5563',
  },
  statistics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
